import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Transaction creation schema
const createTransactionSchema = z.object({
  amount: z.number().min(0),
  currency: z.string().default('USD'),
  merchantId: z.string(),
  merchantName: z.string().optional(),
  customerId: z.string(),
  customerEmail: z.string().email().optional(),
  location: z.string().optional(),
  ipAddress: z.string().optional(),
  deviceId: z.string().optional(),
})

// Fraud detection logic
function calculateFraudScore(transaction: any): { score: number; riskLevel: string; alerts: any[] } {
  let score = 0
  const alerts = []
  
  // High amount check
  if (transaction.amount > 10000) {
    score += 0.3
    alerts.push({
      type: 'HIGH_AMOUNT',
      severity: 'HIGH',
      title: 'High Amount Transaction',
      description: `Transaction amount $${transaction.amount} exceeds threshold`
    })
  }
  
  // Very high amount
  if (transaction.amount > 50000) {
    score += 0.4
    alerts.push({
      type: 'HIGH_AMOUNT',
      severity: 'CRITICAL',
      title: 'Critical Amount Transaction',
      description: `Transaction amount $${transaction.amount} is critically high`
    })
  }
  
  // Unusual time (basic check - between 2 AM and 6 AM)
  const hour = new Date().getHours()
  if (hour >= 2 && hour <= 6) {
    score += 0.2
    alerts.push({
      type: 'SUSPICIOUS_PATTERN',
      severity: 'MEDIUM',
      title: 'Unusual Time Transaction',
      description: 'Transaction occurred during unusual hours'
    })
  }
  
  // Random ML-like score (in real app, this would be actual ML model)
  const mlScore = Math.random() * 0.3
  score += mlScore
  
  if (mlScore > 0.2) {
    alerts.push({
      type: 'ML_PREDICTION',
      severity: 'MEDIUM',
      title: 'ML Model Alert',
      description: 'Machine learning model flagged this transaction'
    })
  }
  
  // Determine risk level
  let riskLevel = 'LOW'
  if (score > 0.7) riskLevel = 'CRITICAL'
  else if (score > 0.5) riskLevel = 'HIGH'
  else if (score > 0.3) riskLevel = 'MEDIUM'
  
  return { score: Math.min(score, 1), riskLevel, alerts }
}

// GET - Fetch transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const riskLevel = searchParams.get('riskLevel')
    
    const where = riskLevel ? { riskLevel: riskLevel as any } : {}
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        alerts: true,
        _count: {
          select: { alerts: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })
    
    const total = await prisma.transaction.count({ where })
    
    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTransactionSchema.parse(body)
    
    // Calculate fraud score and risk
    const { score, riskLevel, alerts } = calculateFraudScore(validatedData)
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        fraudScore: score,
        riskLevel: riskLevel as any,
        isBlocked: score > 0.8, // Auto-block high-risk transactions
      },
    })
    
    // Create alerts if any
    if (alerts.length > 0) {
      await prisma.alert.createMany({
        data: alerts.map(alert => ({
          ...alert,
          transactionId: transaction.id,
        }))
      })
    }
    
    // Fetch the complete transaction with alerts
    const completeTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: { alerts: true }
    })
    
    return NextResponse.json(completeTransaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
